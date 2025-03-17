import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { RootState } from "../redux/store";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import {
  Button,
  TextField,
  Avatar,
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
} from "@mui/material";
import { UploadFile, CheckCircle } from "@mui/icons-material";

interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
}

interface Listing {
  _id: string;
  name: string;
  imageUrls: string[];
}

export default function Profile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector(
    (state: RootState) => state.user
  ) as {
    currentUser: User | null;
    loading: boolean;
    error: string | null;
  };

  const [file, setFile] = useState<File | null>(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState<Listing[]>([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file: File) => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prev) => ({ ...prev, avatar: downloadURL }))
        );
      }
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure((error as Error).message));
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure((error as Error).message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      await fetch("/api/auth/signout");
      dispatch(deleteUserSuccess()); // Fixed by removing `null`
    } catch (error) {
      dispatch(deleteUserFailure((error as Error).message));
    }
  };

  const handleShowListings = async () => {
    if (!currentUser) return;

    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (!data.success) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch {
      setShowListingsError(true);
    }
  };

  if (!currentUser) {
    return (
      <Typography align="center">
        You need to be logged in to view this page.
      </Typography>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Avatar
              src={formData.avatar || currentUser.avatar}
              sx={{ width: 80, height: 80 }}
            />
          </Grid>
          <Grid item>
            <input
              type="file"
              hidden
              ref={fileRef}
              accept="image/*"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            <IconButton
              color="primary"
              onClick={() => fileRef.current?.click()}
            >
              <UploadFile />
            </IconButton>
          </Grid>
        </Grid>

        {filePerc > 0 && filePerc < 100 && (
          <Typography align="center">Uploading: {filePerc}%</Typography>
        )}
        {fileUploadError && (
          <Alert severity="error">Error: Image must be less than 2MB</Alert>
        )}

        <TextField
          id="username"
          label="Username"
          defaultValue={currentUser.username}
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          id="email"
          label="Email"
          defaultValue={currentUser.email}
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Update Profile"}
        </Button>
      </Box>

      <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
        <Button color="error" onClick={handleDeleteUser}>
          Delete Account
        </Button>
        <Button color="error" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {updateSuccess && (
        <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Button
        fullWidth
        variant="outlined"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleShowListings}
      >
        Show Listings
      </Button>
      {showListingsError && (
        <Alert severity="error">Error fetching listings</Alert>
      )}
    </Container>
  );
}

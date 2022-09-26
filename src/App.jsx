import { Routes, Route } from "react-router-dom";
import {
  Login,
  Register,
  Home,
  Vets,
  Clinics,
  Appointements,
  User,
  SingleVet,
  SingleClinic,
  PendingVet,
  PendingClinic,
  CommentReports,
  Invoices
} from "./pages";
import { RequireAuth, RequireNotAuth, Layout, AuthLayout } from "./components";

const App = () => {
  return (
    <Routes>
      <Route
        element={
          <RequireNotAuth>
            <Layout />
          </RequireNotAuth>
        }
      >
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route
        element={
          <RequireAuth>
            <AuthLayout />
          </RequireAuth>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/users/:userId" element={<User />} />
        <Route path="/vets" element={<Vets />} />
        <Route path="/vets/:vetId" element={<SingleVet />} />
        <Route path="/pending/vets" element={<PendingVet />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/clinics" element={<Clinics />} />
        <Route path="/clinics/:clinicId" element={<SingleClinic />} />
        <Route path="/pending/clinics" element={<PendingClinic />} />
        <Route path="/appointements" element={<Appointements />} />
        <Route path="/comment-reports" element={<CommentReports />} />
      </Route>
    </Routes>
  );
};

export default App;

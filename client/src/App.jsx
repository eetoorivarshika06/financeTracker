import AuthInitializer from "./components/AuthInitializer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthInitializer>
      <AppRoutes />
    </AuthInitializer>
  );
}

export default App;

import PlaneFocusBackground from "../components/PlaneFocus";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <PlaneFocusBackground
      imageUrl="/images/plane.jpg"
      blurAmount={10}
      focusRadius={140}
      transitionMs={200}
    >
      <LoginForm />
    </PlaneFocusBackground>
  );
}

export default Login;

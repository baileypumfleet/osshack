import { SignUp } from "@clerk/remix";

export default function Signup() {
  return (
    <div className="h-screen flex items-center" style={{backgroundImage: "url(\"background.jpg\")", backgroundSize: "4350px"}}>
      <div className="mx-auto animate-in zoom-in duration-300">
        <SignUp afterSignUpUrl="/profile" />
      </div>
    </div>
  );
}

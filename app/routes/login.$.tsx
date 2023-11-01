import { SignIn } from "@clerk/remix";

export default function Login() {
  return (
    <div className="h-screen flex items-center" style={{backgroundImage: "url(\"background.jpg\")", backgroundSize: "4350px"}}>
      <div className="mx-auto animate-in zoom-in duration-300">
        <SignIn />
      </div>
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Greetings() {
  return (
    <div className="w-fit h-fit flex items-center gap-2">
      <Avatar>
        <AvatarImage src="/images/mae.jpg" />
        <AvatarFallback>EC</AvatarFallback>
      </Avatar>
      <h1>Olá, Mãe!</h1>
    </div>
  );
}

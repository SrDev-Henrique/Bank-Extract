// import Component from "@/components/file-input";

import Content from "@/components/home";
import Greetings from "@/components/OriginUI/greetings";

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl p-4 flex flex-col gap-4 py-10">
      <h1 className="text-2xl font-bold self-center dark:text-white">
        Controle de Movimentações
      </h1>
      <Greetings />
      <Content />
    </div>
  );
}

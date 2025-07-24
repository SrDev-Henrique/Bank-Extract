import { Search, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

const movsFilterSchema = z.object({
  search: z.string(),
});

type MovsFilterType = z.infer<typeof movsFilterSchema>;

interface MovsFilterProps {
  onFilter: (searchTerm: string) => void;
  onClear: () => void;
  currentFilter: string;
}

export default function MovsFilter({
  onFilter,
  onClear,
  currentFilter,
}: MovsFilterProps) {
  const { register, handleSubmit, reset, setValue } = useForm<MovsFilterType>({
    resolver: zodResolver(movsFilterSchema),
    defaultValues: {
      search: currentFilter,
    },
  });

  // Sincronizar o valor do input com o filtro atual
  useEffect(() => {
    setValue("search", currentFilter);
  }, [currentFilter, setValue]);

  function handleFilterMovs(data: MovsFilterType) {
    onFilter(data.search);
  }

  function handleClear() {
    reset({ search: "" });
    onClear();
  }

  return (
    <div>
      <form className="flex gap-2" onSubmit={handleSubmit(handleFilterMovs)}>
        <Input
          type="text"
          placeholder="Filtrar por descrição..."
          {...register("search")}
          className="text-[18px]"
        />
        <Button type="submit" variant="link">
          <Search className="size-4" />
          Filtrar
        </Button>
        <Button type="button" variant="destructive" onClick={handleClear}>
          <XIcon className="size-4" />
          Limpar
        </Button>
      </form>
    </div>
  );
}

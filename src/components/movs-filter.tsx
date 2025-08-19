import { Search, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

export const options = [
  { label: "Todas", value: "Todas" },
  { label: "Airbnb", value: "Airbnb" },
  { label: "Alimentação", value: "Alimentação" },
  { label: "Massagem", value: "Massagem" },
  { label: "Empréstimo", value: "Empréstimo" },
  { label: "Fatura cartão", value: "Fatura cartão" },
  { label: "Site massagem", value: "Site massagem" },
  { label: "Aluguel", value: "Aluguel" },
  { label: "Roupas", value: "Roupas" },
  { label: "Sobrancelha", value: "Sobrancelha" },
  { label: "Mercado", value: "Mercado" },
  { label: "Autoposto", value: "Autoposto" },
  { label: "Lenço", value: "Lenço" },
  { label: "Aluguel de sala", value: "Aluguel de sala" },
  { label: "Costureira", value: "Costureira" },
  { label: "Limpeza de pele", value: "Limpeza de pele" },
  { label: "Cuidados de pet", value: "Cuidados de pet" },
  { label: "Receita federal", value: "Receita federal" },
  { label: "Plano móvel", value: "Plano móvel" },
  { label: "Conta de luz", value: "Conta de luz" },
  { label: "MEI", value: "MEI" },
  { label: "IOF", value: "IOF" },
  { label: "Parafusos", value: "Parafusos" },
  { label: "Cabeleireiro", value: "Cabeleireiro" },
  { label: "Dízimo", value: "Dízimo" },
  { label: "Farmácia", value: "Farmácia" },
  { label: "Acessório celular", value: "Acessório celular" },
  { label: "Telefonia", value: "Telefonia" },
  { label: "Conta de água", value: "Conta de água" },
  { label: "Perfumaria", value: "Perfumaria" },
  { label: "Diversos", value: "Diversos" },
  { label: "Saque", value: "Saque" },
  { label: "Curso online", value: "Curso online" },
  { label: "Loteria", value: "Loteria" },
  { label: "Podologia", value: "Podologia" },
  { label: "Causa trabalhista", value: "Causa trabalhista" },
  { label: "Pedágio", value: "Pedágio" },
  { label: "Juros", value: "Juros" },
  { label: "Internet", value: "Internet" },
  { label: "Consulta médica", value: "Consulta médica" },
  { label: "Recarga celular", value: "Recarga celular" },
  { label: "Trafego pago", value: "Trafego pago" },
];

const movsFilterSchema = z.object({
  search: z.string(),
  category: z.string().optional(),
});

type MovsFilterType = z.infer<typeof movsFilterSchema>;

interface MovsFilterProps {
  onFilter: (filters: { search: string; category: string }) => void;
  onClear: () => void;
  currentFilter: string;
  currentCategory: string;
}

export default function MovsFilter({
  onFilter,
  onClear,
  currentFilter,
  currentCategory,
}: MovsFilterProps) {
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<MovsFilterType>({
      resolver: zodResolver(movsFilterSchema),
      defaultValues: {
        search: currentFilter ?? "",
        category: currentCategory ?? "Todas",
      },
    });

  useEffect(() => {
    setValue("search", currentFilter ?? "");
  }, [currentFilter, setValue]);

  useEffect(() => {
    setValue("category", currentCategory ?? "Todas");
  }, [currentCategory, setValue]);

  const watchedSearch = watch("search");
  const watchedCategory = watch("category");

  function handleFilterMovs(data: MovsFilterType) {
    onFilter({ search: data.search ?? "", category: data.category ?? "" });
  }

  function handleClear() {
    reset({ search: "", category: "Todas" });
    onClear();
  }

  useEffect(() => {
    onFilter({ search: watchedSearch ?? "", category: watchedCategory ?? "" });
  }, [watchedCategory, watchedSearch, onFilter]);

  return (
    <div className="">
      <form className="flex gap-2" onSubmit={handleSubmit(handleFilterMovs)}>
        <Select
          value={watchedCategory ?? "Todas"}
          onValueChange={(val) => {
            setValue("category", val);
          }}
        >
          <SelectTrigger className="w-[200px] text-nowrap overflow-hidden">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

/** biome-ignore-all lint/a11y/useFocusableInteractive: because */
/** biome-ignore-all lint/a11y/useSemanticElements: because */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: because */
"use client";

import {
  AlertCircleIcon,
  PaperclipIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { parsePdf } from "@/utils/parsePdf";
import type { Movimentacao } from "@/types/types";
import Loading from "../loading";

export default function FileUpload({
  setMovimentacoes,
}: {
  setMovimentacoes: (movimentacoes: Movimentacao[] | null) => void;
}) {
  const maxSize = 10 * 1024 * 1024;

  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    maxSize,
    accept: ".pdf",
  });

  const file = files[0];

  useEffect(() => {
    if (!file) {
      setMovimentacoes(null);
      setParseError(null);
      return;
    }

    const runParse = async () => {
      setLoading(true);
      setParseError(null);
      try {
        const data = await parsePdf(file.file as File);
        setMovimentacoes(data);
      } catch (err: unknown) {
        console.error(err);
        setParseError(
          "Falha ao processar o PDF. Verifique o formato do arquivo."
        );
      } finally {
        setLoading(false);
      }
    };

    runParse();
  }, [file, setMovimentacoes]);

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload file"
          disabled={Boolean(file)}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <UploadIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Carregar PDF do extrato</p>
          <p className="text-muted-foreground text-xs">
            Arraste e solte ou clique para navegar (máx. {formatBytes(maxSize)})
          </p>
        </div>
      </div>

      {/* Erros de upload */}
      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* Erro de parsing */}
      {parseError && (
        <div className="text-destructive text-xs" role="alert">
          <AlertCircleIcon className="size-3 inline-block" /> {parseError}
        </div>
      )}

      {/* Spinner durante parsing */}
      {loading && (
        <div className="flex justify-center w-full">
          <Loading />
        </div>
      )}

      {/* Lista de arquivo e resultado */}
      {file && !loading && (
        <div className="space-y-2">
          <div
            key={file.id}
            className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <PaperclipIcon
                className="size-4 shrink-0 opacity-60"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">
                  {file.file.name}
                </p>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove file"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

import { ConfiguracoesClient } from "./ConfiguracoesClient";

export default function ConfiguracoesPage() {
  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Configurações</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Ajuste os limites e preferências do sistema
        </p>
      </div>

      <ConfiguracoesClient />
    </div>
  );
}

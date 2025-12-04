import React from 'react';
import { Info, TrendingUp, Target, ShieldCheck } from 'lucide-react';

export const InfoSection: React.FC = () => {
  return (
    <div className="mt-12 space-y-8 text-gray-700 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      <div className="border-l-4 border-primary-700 pl-4">
        <h2 className="text-2xl font-bold text-gray-900">Entendendo a Calculadora</h2>
        <p className="mt-2 text-gray-600">
          Esta ferramenta foi projetada para dar clareza ao seu futuro financeiro. Seja para descobrir quanto tempo falta para o seu primeiro milhão ou quanto você precisa economizar mensalmente, nós simplificamos a matemática dos juros compostos para você.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3 text-primary-800">
            <Target className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Modos de Cálculo</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li>
              <strong className="text-gray-900">Simulação Livre:</strong> Ideal para quem já tem um plano. Você insere quanto tem, quanto vai aportar, a taxa e o tempo, e nós mostramos o resultado final.
            </li>
            <li>
              <strong className="text-gray-900">Prazo para 1 Milhão:</strong> Descubra exatamente quando você se tornará milionário mantendo seus aportes atuais.
            </li>
            <li>
              <strong className="text-gray-900">Aporte para 1 Milhão:</strong> Defina quando quer atingir a meta e nós calculamos quanto você precisa investir por mês.
            </li>
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 text-primary-800">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-semibold text-lg">O Poder dos Juros Compostos</h3>
          </div>
          <p className="text-sm leading-relaxed">
            Nossa calculadora utiliza a fórmula de juros compostos com reinvestimento automático. Isso significa que os juros que você ganha no primeiro mês também rendem juros no mês seguinte, criando um efeito "bola de neve" que acelera seu enriquecimento no longo prazo.
          </p>
          <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex items-start gap-3">
             <ShieldCheck className="w-5 h-5 text-yellow-700 shrink-0 mt-0.5" />
             <p className="text-xs text-yellow-800">
               <strong>Nota Importante:</strong> Os cálculos não consideram inflação ou Imposto de Renda. Para um planejamento preciso da vida real, lembre-se que o poder de compra de R$ 1 milhão no futuro será menor do que hoje.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
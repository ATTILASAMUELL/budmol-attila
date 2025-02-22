import React from 'react';
import GenericLayout from '../components/GenericLayout';

const Help: React.FC = () => {
  return (
    <GenericLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white border border-orange-500 rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Perguntas Frequentes
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Como me inscrevo em um evento?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Para se inscrever em um evento, basta clicar no botão "Se Inscrever" na página do evento.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Como posso entrar em contato com o suporte?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Você pode entrar em contato através do e-mail suporte@budmol.com ou pelo nosso chat ao vivo.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Quais métodos de pagamento são aceitos?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Aceitamos cartões de crédito, cartões de débito e transferências bancárias.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-4 flex flex-col items-center">
              <img
                src="http://127.0.0.1:8000/ceo-attila.jpg"
                alt="CEO Attila Samuell"
                className="w-64 h-64 object-cover rounded-full border border-orange-500"
              />
              <p className="mt-4 text-xl font-bold text-gray-800">
                CEO - Attila Samuell
              </p>

            </div>
          </div>
        </div>
      </div>
    </GenericLayout>
  );
};

export default Help;

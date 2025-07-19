import Link from "next/link"
import { Calendar, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">BI Angola</h3>
                <p className="text-sm text-gray-400">Sistema Oficial</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sistema oficial de agendamento para emissão do Bilhete de Identidade da República de Angola. Simplifique o
              seu processo de obtenção de documentos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/agendar" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Fazer Agendamento
                </Link>
              </li>
              <li>
                <Link href="/agendamentos" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Meus Agendamentos
                </Link>
              </li>
              <li>
                <Link href="/perfil" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Meu Perfil
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Registar
                </Link>
              </li>
            </ul>
          </div>

          {/* Serviços */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Serviços</h4>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">Emissão de BI</li>
              <li className="text-gray-300 text-sm">Renovação de BI</li>
              <li className="text-gray-300 text-sm">Atualização de Dados</li>
              <li className="text-gray-300 text-sm">2ª Via de BI</li>
              <li className="text-gray-300 text-sm">Certidão de Registo</li>
              <li className="text-gray-300 text-sm">Consulta de Estado</li>
            </ul>
          </div>

          {/* Contactos */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contactos</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Rua Comandante Che Guevara, nº 206
                    <br />
                    Luanda, Angola
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">+244 222 000 000</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">info@bi.gov.ao</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Segunda - Sexta: 08:00 - 16:00
                    <br />
                    Sábado: 08:00 - 12:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 República de Angola - Ministério do Interior. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              <Link href="/politica-privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/termos-uso" className="text-gray-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </Link>
              <Link href="/ajuda" className="text-gray-400 hover:text-white text-sm transition-colors">
                Ajuda
              </Link>
              <Link href="/contactos" className="text-gray-400 hover:text-white text-sm transition-colors">
                Contactos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

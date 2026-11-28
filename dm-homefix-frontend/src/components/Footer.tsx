import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Share2, MessageCircle, AtSign } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Logo size="md" className="mb-3" />
          <p className="text-sm text-gray-400 mt-2">Professional home repair services in Debre Markos, Ethiopia.</p>
          <p className="text-sm font-semibold text-orange-400 mt-2">Fix It Right. Live Better.</p>
          <div className="flex gap-3 mt-4">
            {[Share2, MessageCircle, AtSign].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 bg-gray-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            {['Plumbing','Electrical','Painting','Carpentry','Cleaning','AC Repair','Appliance Repair','Masonry'].map(s => (
              <li key={s}><Link to="/services" className="hover:text-orange-400 transition-colors">{s}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {([['/','Home'],['/technicians','Find a Technician'],['/book','Book a Service'],['/about','About Us'],['/reviews','Reviews'],['/contact','Contact']] as [string,string][]).map(([href,label]) => (
              <li key={href}><Link to={href} className="hover:text-orange-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />Debre Markos, Amhara Region, Ethiopia</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-orange-400" />+251 91 234 5678</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-orange-400" />info@dmhomefix.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} DM HomeFix. All rights reserved. | Debre Markos, Ethiopia
      </div>
    </footer>
  )
}

import Link from 'next/link';

export default function AdminLayout({ children, params }: { children: React.ReactNode, params: any }) {
  // Directly extract locale, avoiding strict TS errors if param types fluctuate in Next Pages
  const locale = params?.locale || 'fr';

  const navLinks = [
    { label: 'Products', href: `/${locale}/admin/products` },
    { label: 'Categories', href: `/${locale}/admin/categories` },
    { label: 'Global Settings', href: `/${locale}/admin/settings` }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 flex flex-col md:flex-row rtl:flex-row-reverse" dir="ltr">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 p-8 flex flex-col hidden md:flex">
        <h1 className="text-xl font-black tracking-[0.2em] uppercase mb-16 text-white leading-tight">
          System<br/><span className="text-[#FF6A00]">Core</span>
        </h1>
        
        <nav className="flex-1 flex flex-col gap-6">
          {navLinks.map((link) => (
             <Link key={link.href} href={link.href} className="flex items-center text-xs uppercase tracking-[0.1em] font-bold text-neutral-500 hover:text-white transition-colors">
                {link.label}
             </Link>
          ))}
        </nav>
        
        <div className="mt-auto pt-8 border-t border-neutral-800">
          <Link href={`/${locale}`} className="text-[10px] uppercase tracking-widest text-[#FF6A00] font-bold hover:text-white transition-colors">
             Return to Storefront
          </Link>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-6 md:p-16 overflow-y-auto w-full relative z-10">
        <div className="max-w-5xl">
           {children}
        </div>
      </main>
    </div>
  );
}

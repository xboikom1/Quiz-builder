import AppHeader from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <AppHeader />
    <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
  </div>
);

export default Layout;

import { Link } from "react-router-dom";
export default function Soon({ title }: { title: string }) {
  return <div className="mx-auto max-w-md rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h1 className="text-xl font-bold">{title}</h1><p className="mt-2 text-sm text-slate-500">Ten widok jest w przygotowaniu.</p><Link to="/projects" className="mt-4 inline-block text-brand-600 underline">Odkrywaj projekty</Link></div>;
}

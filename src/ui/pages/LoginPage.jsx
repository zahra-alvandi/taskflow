import { useState } from "react";
import { Mail, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { CatEars } from "../components/CatDecorations";

function LoginPage({ onLogin }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onLogin(email.trim());
    } catch (err) {
      setError(err.message ?? t("auth.invalidEmail"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 paw-bg-warm ">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden bg-[var(--primary)] shadow-[0_12px_28px_rgba(232,135,74,0.4)] relative mb-4">
            <img
              src="/favicon/logo-icon.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {t("app.name")}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {t("auth.welcome")}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] relative overflow-hidden"
        >
          {/* Cat ears decoration */}
          <div className="absolute -top-2 start-1/2 -translate-x-1/2 text-[var(--primary)] opacity-30">
            <CatEars size={40} />
          </div>

          <div className="relative pt-4">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              {t("auth.emailLabel")}
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                required
                autoFocus
                className="w-full ps-11 pe-4 py-3 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-[var(--danger-soft)]">
                <AlertCircle
                  size={15}
                  className="text-[var(--danger)] shrink-0 mt-0.5"
                />
                <p className="text-xs text-[var(--danger)]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white font-semibold shadow-[0_8px_20px_rgba(232,135,74,0.35)] hover:shadow-[0_10px_24px_rgba(232,135,74,0.45)] active:scale-[0.98] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                t("auth.loggingIn")
              ) : (
                <>
                  {t("auth.continue")}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
          <Sparkles size={12} className="text-[var(--accent)]" />
          <span>{t("auth.privacyNote")}</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

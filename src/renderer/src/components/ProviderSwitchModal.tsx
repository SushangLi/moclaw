import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from './Button'
import LogViewer from './LogViewer'
import { useInstallLogs } from '../hooks/useIpc'
import { providerConfigs, type Provider } from '../constants/providers'

type Phase = 'form' | 'progress' | 'done' | 'error'

interface Props {
  currentProvider?: string
  currentModel?: string
  onClose: () => void
  onSuccess: () => void
}

export default function ProviderSwitchModal({
  currentProvider,
  currentModel,
  onClose,
  onSuccess
}: Props): React.JSX.Element {
  const { t } = useTranslation('management')
  const { t: tp } = useTranslation('providers')
  const [phase, setPhase] = useState<Phase>('form')
  const validProviders = providerConfigs.map((p) => p.id)
  const initProvider =
    currentProvider && validProviders.includes(currentProvider as Provider)
      ? (currentProvider as Provider)
      : providerConfigs[0]?.id || 'momoai'
  const initConfig = providerConfigs.find((p) => p.id === initProvider)!
  const initModelId =
    currentModel && initConfig.models.some((m) => m.id === currentModel)
      ? currentModel
      : initConfig.models[0]?.id || 'momo_222'
  const [modelId, setModelId] = useState(initModelId)
  const [apiKey, setApiKey] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const { logs, clearLogs } = useInstallLogs()

  const selected = providerConfigs.find((p) => p.id === initProvider)!
  const apiKeyValid = selected.pattern.test(apiKey)

  const handleSwitch = async (): Promise<void> => {
    setPhase('progress')
    setErrorMsg('')
    clearLogs()
    try {
      const result = await window.electronAPI.config.switchProvider({
        provider: initProvider,
        apiKey,
        modelId
      })
      if (result.success) {
        setPhase('done')
      } else {
        setErrorMsg(result.error || t('common:error.occurred'))
        setPhase('error')
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : t('common:error.unknown'))
      setPhase('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-sm mx-4 p-6 space-y-4 max-h-[85vh] flex flex-col">
        <h3 className="text-base font-black shrink-0">{t('providerSwitch.title')}</h3>

        {phase === 'form' && (
          <div className="space-y-3 overflow-y-auto min-h-0">
            {/* Model list */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted">
                {t('providerSwitch.modelSelect')}
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {selected.models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModelId(m.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 cursor-pointer ${
                      modelId === m.id
                        ? 'bg-primary/15 border border-primary/40'
                        : 'bg-white/5 border border-transparent hover:bg-white/8'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 shrink-0 transition-colors ${
                        modelId === m.id
                          ? 'border-primary bg-primary'
                          : 'border-text-muted/30 bg-transparent'
                      }`}
                    />
                    <div className="min-w-0 flex-1 flex items-baseline gap-1.5">
                      <span className="text-xs font-bold whitespace-nowrap">{m.name}</span>
                      <span className="text-[10px] text-text-muted/60 truncate">
                        {tp(`desc.${m.id}`, m.desc)}
                      </span>
                      {m.price && (
                        <span className="text-[10px] text-text-muted/40 font-mono ml-auto shrink-0">
                          {m.price}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* API Key input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted">
                {t('providerSwitch.apiKey')}
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={tp(`apiKeyPlaceholder.${initProvider}`, selected.placeholder)}
                className={`w-full bg-bg-input rounded-xl px-4 py-2 text-sm font-mono outline-none border transition-all duration-200 placeholder:text-text-muted/30 ${
                  apiKey && !apiKeyValid
                    ? 'border-error/50 focus:border-error'
                    : 'border-glass-border focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-glow)]'
                }`}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="secondary" size="sm" onClick={onClose}>
                {t('providerSwitch.cancel')}
              </Button>
              <Button variant="primary" size="sm" onClick={handleSwitch} disabled={!apiKeyValid}>
                {t('providerSwitch.change')}
              </Button>
            </div>
          </div>
        )}

        {phase === 'progress' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.25"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-sm font-medium">{t('providerSwitch.switching')}</span>
            </div>
            {logs.length > 0 && <LogViewer lines={logs} />}
          </div>
        )}

        {phase === 'done' && (
          <div className="text-center py-4 space-y-3">
            <div className="flex justify-center">
              <svg
                className="h-12 w-12 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm font-medium">{t('providerSwitch.success')}</p>
            <Button variant="primary" size="sm" onClick={onSuccess}>
              {t('common:button.done')}
            </Button>
          </div>
        )}

        {phase === 'error' && (
          <div className="space-y-3">
            <div className="text-center py-2">
              <p className="text-sm text-error font-medium">{errorMsg}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPhase('form')}>
                {t('common:button.back')}
              </Button>
              <Button variant="primary" size="sm" onClick={handleSwitch}>
                {t('common:button.retry')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LobsterLogo from '../components/LobsterLogo'
import Button from '../components/Button'
import LogViewer from '../components/LogViewer'
import { useInstallLogs } from '../hooks/useIpc'

type Provider = 'momoai'

const providerPatterns: Record<Provider, RegExp> = {
  momoai: /^momo_/
}

const providerPlaceholders: Record<Provider, string> = {
  momoai: 'momo_xxxxx'
}

const BOT_TOKEN_PATTERN = /^\d+:[A-Za-z0-9_-]+$/
const FEISHU_APP_ID_PATTERN = /^cli_[A-Za-z0-9]+$/

interface CloudSelections {
  feishuEnabled: boolean
  telegramEnabled: boolean
  installFeishuPlugin: boolean
}

interface Props {
  provider: Provider
  modelId?: string
  cloudSelections: CloudSelections
  onDone: (botUsername?: string) => void
}

export default function ConfigStep({
  provider,
  modelId,
  cloudSelections,
  onDone
}: Props): React.JSX.Element {
  const { t } = useTranslation(['steps', 'common'])
  const { t: tp } = useTranslation('providers')
  const [apiKey, setApiKey] = useState('')
  const [botToken, setBotToken] = useState('')
  const [feishuAppId, setFeishuAppId] = useState('')
  const [feishuAppSecret, setFeishuAppSecret] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { logs, clearLogs } = useInstallLogs()

  const pattern = providerPatterns[provider]
  const label = t(`config.apiKeyLabel.${provider}`)
  const placeholder = tp(`apiKeyPlaceholder.${provider}`, providerPlaceholders[provider])
  const apiKeyValid = pattern.test(apiKey)
  const botTokenValid = BOT_TOKEN_PATTERN.test(botToken)
  const feishuAppIdValid = FEISHU_APP_ID_PATTERN.test(feishuAppId)
  const feishuAppSecretValid = feishuAppSecret.trim().length > 0
  const feishuValid = !cloudSelections.feishuEnabled || (feishuAppIdValid && feishuAppSecretValid)
  const telegramValid = !cloudSelections.telegramEnabled || !botToken || botTokenValid
  const canSave = apiKeyValid && feishuValid && telegramValid && !saving

  const handleSave = async (): Promise<void> => {
    setSaving(true)
    setError(null)
    clearLogs()
    try {
      const result = await window.electronAPI.onboard.run({
        provider,
        apiKey,
        feishuAppId: cloudSelections.feishuEnabled ? feishuAppId : undefined,
        feishuAppSecret: cloudSelections.feishuEnabled ? feishuAppSecret : undefined,
        installFeishuPlugin: cloudSelections.feishuEnabled
          ? cloudSelections.installFeishuPlugin
          : false,
        telegramBotToken: cloudSelections.telegramEnabled ? botToken || undefined : undefined,
        modelId
      })
      if (result.success) {
        onDone(result.botUsername)
      } else {
        setError(result.error ?? t('config.errorOccurred'))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common:error.unknown'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 px-8 pt-6">
      <div className="flex-1 overflow-y-auto pb-2 space-y-4">
        <div className="flex items-center gap-3">
          <LobsterLogo state={saving ? 'loading' : 'idle'} size={48} />
          <div>
            <h2 className="text-lg font-extrabold">{t('config.title')}</h2>
            <p className="text-text-muted text-xs">{t('config.desc')}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold">
            {label} <span className="text-error text-xs">{t('config.required')}</span>
          </label>
          <input
            type="password"
            placeholder={placeholder}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className={`w-full bg-bg-input rounded-xl px-4 py-2.5 text-sm font-mono outline-none border transition-all duration-200 placeholder:text-text-muted/30 ${
              apiKey && !apiKeyValid
                ? 'border-error/50 focus:border-error'
                : 'border-glass-border focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-glow)]'
            }`}
          />
        </div>

        {cloudSelections.feishuEnabled && (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-bold">
                {t('config.feishuAppId')}{' '}
                <span className="text-error text-xs">{t('config.required')}</span>
              </label>
              <input
                type="text"
                placeholder="cli_xxxxx"
                value={feishuAppId}
                onChange={(e) => setFeishuAppId(e.target.value)}
                className={`w-full bg-bg-input rounded-xl px-4 py-2.5 text-sm font-mono outline-none border transition-all duration-200 placeholder:text-text-muted/30 ${
                  feishuAppId && !feishuAppIdValid
                    ? 'border-error/50 focus:border-error'
                    : 'border-glass-border focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-glow)]'
                }`}
              />
              {feishuAppId && !feishuAppIdValid && (
                <p className="text-error text-[11px] font-medium">{t('config.feishuAppIdHint')}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold">
                {t('config.feishuAppSecret')}{' '}
                <span className="text-error text-xs">{t('config.required')}</span>
              </label>
              <input
                type="password"
                placeholder={t('config.feishuAppSecretPlaceholder')}
                value={feishuAppSecret}
                onChange={(e) => setFeishuAppSecret(e.target.value)}
                className={`w-full bg-bg-input rounded-xl px-4 py-2.5 text-sm font-mono outline-none border transition-all duration-200 placeholder:text-text-muted/30 ${
                  feishuAppSecret && !feishuAppSecretValid
                    ? 'border-error/50 focus:border-error'
                    : 'border-glass-border focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-glow)]'
                }`}
              />
            </div>
          </>
        )}

        {cloudSelections.telegramEnabled && (
          <div className="space-y-1.5">
            <label className="text-sm font-bold">
              {t('config.telegramToken')}{' '}
              <span className="text-text-muted text-xs">({t('config.optional')})</span>
            </label>
            <input
              type="text"
              placeholder="123456:ABCDEF..."
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              className={`w-full bg-bg-input rounded-xl px-4 py-2.5 text-sm font-mono outline-none border transition-all duration-200 placeholder:text-text-muted/30 ${
                botToken && !botTokenValid
                  ? 'border-error/50 focus:border-error'
                  : 'border-glass-border focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-glow)]'
              }`}
            />
            {botToken && !botTokenValid && (
              <p className="text-error text-[11px] font-medium">{t('config.telegramHint')}</p>
            )}
          </div>
        )}

        {logs.length > 0 && <LogViewer lines={logs} />}
        {error && <p className="text-error text-xs font-medium">{error}</p>}
      </div>

      <div className="shrink-0 flex justify-end py-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          disabled={!canSave}
          loading={saving}
        >
          {saving ? t('config.savingBtn') : t('config.saveBtn')}
        </Button>
      </div>
    </div>
  )
}

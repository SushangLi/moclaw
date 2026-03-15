import { useTranslation } from 'react-i18next'
import Button from '../components/Button'
import { providerConfigs, type Provider } from '../constants/providers'

interface Props {
  provider: Provider
  modelId?: string
  onSelectModel: (id: string) => void
  onNext: () => void
}

export default function ApiKeyGuideStep({
  provider,
  modelId,
  onSelectModel,
  onNext
}: Props): React.JSX.Element {
  const { t } = useTranslation('steps')
  const { t: tp } = useTranslation('providers')
  const providerConfig = providerConfigs.find((p) => p.id === provider)!
  const selectedModelId = modelId ?? providerConfig.models[0].id

  return (
    <div className="flex-1 flex flex-col min-h-0 px-8">
      <div className="shrink-0 text-center space-y-0.5 pt-2 pb-1.5">
        <h2 className="text-lg font-extrabold">{t('apiKeyGuide.title')}</h2>
        <p className="text-text-muted text-xs">{t('apiKeyGuide.desc')}</p>
      </div>

      {/* Model selection */}
      <div className="flex-1 flex flex-col min-h-0 mt-3">
        <label className="shrink-0 text-xs font-bold text-text-muted mb-1.5">
          {t('apiKeyGuide.modelSelect')}
        </label>
        <div className="space-y-1.5">
          {providerConfig.models.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectModel(m.id)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-left transition-all duration-150 cursor-pointer ${
                selectedModelId === m.id
                  ? 'bg-primary/15 border border-primary/40'
                  : 'bg-white/5 border border-transparent hover:bg-white/8'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full border-2 shrink-0 transition-colors ${
                  selectedModelId === m.id
                    ? 'border-primary bg-primary'
                    : 'border-text-muted/30 bg-transparent'
                }`}
              />
              <div className="min-w-0 flex-1 flex items-baseline gap-1.5">
                <span className="text-sm font-bold whitespace-nowrap">{m.name}</span>
                <span className="text-xs text-text-muted/60 truncate">
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

      <div className="shrink-0 flex justify-end py-3">
        <Button variant="primary" size="lg" onClick={onNext}>
          {t('apiKeyGuide.keyReady')}
        </Button>
      </div>
    </div>
  )
}

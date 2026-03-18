import { useTranslation } from 'react-i18next'
import Button from '../components/Button'

interface CloudSelections {
  feishuEnabled: boolean
  telegramEnabled: boolean
  installFeishuPlugin: boolean
}

interface Props {
  selections: CloudSelections
  onChange: (next: CloudSelections) => void
  onNext: () => void
}

export default function CloudGuideStep({ selections, onChange, onNext }: Props): React.JSX.Element {
  const { t } = useTranslation('steps')
  const options = t('cloudGuide.options', { returnObjects: true }) as {
    key: 'feishu' | 'telegram'
    title: string
    desc: string
  }[]

  const toggle = (key: 'feishu' | 'telegram'): void => {
    if (key === 'feishu') {
      const feishuEnabled = !selections.feishuEnabled
      onChange({
        feishuEnabled,
        telegramEnabled: selections.telegramEnabled,
        installFeishuPlugin: feishuEnabled ? selections.installFeishuPlugin : false
      })
      return
    }

    onChange({
      ...selections,
      telegramEnabled: !selections.telegramEnabled
    })
  }

  const canContinue = selections.feishuEnabled || selections.telegramEnabled

  return (
    <div className="flex-1 flex flex-col min-h-0 px-8">
      <div className="flex-1 space-y-4">
        <div className="text-center space-y-0.5 pt-2 pb-1">
          <h2 className="text-lg font-extrabold">{t('cloudGuide.title')}</h2>
          <p className="text-text-muted text-xs">{t('cloudGuide.desc')}</p>
        </div>

        <div className="space-y-2">
          {options.map((option) => {
            const checked =
              option.key === 'feishu' ? selections.feishuEnabled : selections.telegramEnabled

            return (
              <label
                key={option.key}
                className="glass-card p-3 flex gap-3 items-start cursor-pointer hover:border-primary/40 transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(option.key)}
                  className="mt-0.5 h-4 w-4 rounded border-glass-border accent-primary"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold">{option.title}</p>
                  <p className="text-text-muted text-[11px] leading-snug">{option.desc}</p>
                </div>
              </label>
            )
          })}
        </div>

        {selections.feishuEnabled && (
          <label className="glass-card p-3 flex gap-3 items-start cursor-pointer hover:border-primary/40 transition-all duration-200">
            <input
              type="checkbox"
              checked={selections.installFeishuPlugin}
              onChange={() =>
                onChange({
                  ...selections,
                  installFeishuPlugin: !selections.installFeishuPlugin
                })
              }
              className="mt-0.5 h-4 w-4 rounded border-glass-border accent-primary"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold">{t('cloudGuide.installFeishu.title')}</p>
              <p className="text-text-muted text-[11px] leading-snug">
                {t('cloudGuide.installFeishu.desc')}
              </p>
            </div>
          </label>
        )}
      </div>

      <div className="shrink-0 flex justify-end py-3">
        <Button variant="primary" size="lg" onClick={onNext} disabled={!canContinue}>
          {t('cloudGuide.continue')}
        </Button>
      </div>
    </div>
  )
}

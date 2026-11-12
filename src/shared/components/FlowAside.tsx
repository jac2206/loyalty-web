import { Icon, type IconName } from "./Icon";

type FlowAsideProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: IconName;
  steps: string[];
};

export function FlowAside({ eyebrow, title, description, icon, steps }: FlowAsideProps) {
  return (
    <aside className="flow-aside" aria-label={title}>
      <div className="flow-aside-grid" aria-hidden="true" />
      <span className="flow-aside-icon"><Icon name={icon} /></span>
      <p className="flow-aside-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="flow-aside-description">{description}</p>
      <div className="flow-aside-steps">
        {steps.map((step, index) => (
          <div className="flow-aside-step" key={step}>
            <span aria-hidden="true">0{index + 1}</span><p>{step}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

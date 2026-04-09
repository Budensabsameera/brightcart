import { useState } from "react";

function Accordion({ items, defaultOpenId }) {
  const initialOpenId = defaultOpenId ?? items[0]?.id ?? null;
  const [openId, setOpenId] = useState(initialOpenId);

  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <article key={item.id} className={`accordion-item${isOpen ? " accordion-item-open" : ""}`}>
            <button
              type="button"
              className="accordion-trigger"
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span>{item.title}</span>
              <span className="accordion-indicator">{isOpen ? "-" : "+"}</span>
            </button>

            <div className={`accordion-panel${isOpen ? " accordion-panel-open" : ""}`}>
              <div className="accordion-panel-inner">{item.content}</div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default Accordion;

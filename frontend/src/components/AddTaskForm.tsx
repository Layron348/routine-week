import React, { useState } from "react";

const CATS = [
  { v: "routine", l: "☀️ Рутина" }, { v: "project", l: "🚀 Проект" },
  { v: "work",    l: "💼 Работа"  }, { v: "train",   l: "🏋️ Трен-ка" },
  { v: "rest",    l: "😴 Отдых"   },
];
const PRIOS = [
  { v: "high", l: "🔴 Высокий" }, { v: "medium", l: "🟡 Средний" }, { v: "low", l: "⚪ Низкий" },
];

interface Props {
  date: string;
  onAdd: (date: string, title: string, cat: string, prio: string, ts: string|null, te: string|null, habit: boolean) => void;
  onClose: () => void;
}

export const AddTaskForm: React.FC<Props> = ({ date, onAdd, onClose }) => {
  const [title, setTitle]   = useState("");
  const [cat, setCat]       = useState("routine");
  const [prio, setPrio]     = useState("medium");
  const [ts, setTs]         = useState("");
  const [te, setTe]         = useState("");
  const [habit, setHabit]   = useState(false);

  const submit = () => {
    if (!title.trim()) return;
    onAdd(date, title.trim(), cat, prio, ts||null, te||null, habit);
    onClose();
  };

  return (
    <div className="add-form">
      <input className="add-input" placeholder="Название задачи..." value={title}
        onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} autoFocus />
      <div className="add-form-row">
        <select className="add-select" value={cat} onChange={e => setCat(e.target.value)}>
          {CATS.map(c => <option key={c.v} value={c.v}>{c.l}</option>)}
        </select>
        <select className="add-select" value={prio} onChange={e => setPrio(e.target.value)}>
          {PRIOS.map(p => <option key={p.v} value={p.v}>{p.l}</option>)}
        </select>
      </div>
      <div className="add-form-row">
        <input className="add-input" type="time" value={ts} onChange={e => setTs(e.target.value)} placeholder="Начало" />
        <input className="add-input" type="time" value={te} onChange={e => setTe(e.target.value)} placeholder="Конец" />
      </div>
      <label className="habit-check-label">
        <input type="checkbox" checked={habit} onChange={e => setHabit(e.target.checked)} />
        🔁 Привычка — повторять всю неделю
      </label>
      <div className="add-form-actions">
        <button className="btn-add" onClick={submit}>Добавить</button>
        <button className="btn-cancel" onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
};

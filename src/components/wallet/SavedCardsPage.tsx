import React, { useState } from 'react';
import { SavedCard } from '../../types';
import { INITIAL_SAVED_CARDS } from '../../data/mockData';
import { CreditCard, Plus, Check, Trash2, Eye, ShieldCheck, Sparkles, Lock, RotateCw, X } from 'lucide-react';

export const SavedCardsPage: React.FC = () => {
  const [cards, setCards] = useState<SavedCard[]>(INITIAL_SAVED_CARDS);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  // New Card Modal State
  const [newCardHolder, setNewCardHolder] = useState('Alex Morgan');
  const [newCardNumber, setNewCardNumber] = useState('4532 8912 3004 9921');
  const [newExpiry, setNewExpiry] = useState('12/29');
  const [newCvv, setNewCvv] = useState('771');
  const [newBrand, setNewBrand] = useState<'visa' | 'mastercard' | 'amex'>('visa');

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const createdCard: SavedCard = {
      id: `card-${Date.now()}`,
      cardHolder: newCardHolder,
      cardNumberMasked: `•••• •••• •••• ${newCardNumber.slice(-4)}`,
      expiry: newExpiry,
      cvv: newCvv,
      brand: newBrand,
      isDefault: cards.length === 0,
      bgGradient: newBrand === 'visa' 
        ? 'from-blue-900 via-indigo-950 to-slate-900' 
        : newBrand === 'mastercard' 
        ? 'from-amber-800 via-rose-950 to-slate-900' 
        : 'from-emerald-800 via-teal-950 to-slate-900',
      accentColor: newBrand === 'visa' ? '#3B82F6' : newBrand === 'mastercard' ? '#F59E0B' : '#10B981',
    };

    setCards([createdCard, ...cards]);
    setShowAddModal(false);
  };

  const handleSetDefault = (id: string) => {
    setCards(cards.map((c) => ({ ...c, isDefault: c.id === id })));
  };

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 font-sans">
      
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-1 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Apple Wallet / Revolut Vault
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Cards & Wallet</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage debit and credit cards for instant international transfers
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Card</span>
        </button>
      </div>

      {/* Cards Vault Grid (Apple Wallet 3D Stacked Card Design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const isFlipped = flippedCardId === card.id;

          return (
            <div
              key={card.id}
              className="relative group perspective-1000"
            >
              {/* Card Container */}
              <div
                className={`w-full min-h-[220px] rounded-3xl p-6 text-white shadow-2xl bg-gradient-to-br ${card.bgGradient} border border-white/20 relative overflow-hidden flex flex-col justify-between transition-all duration-500 transform hover:-translate-y-2 hover:shadow-blue-900/20`}
              >
                {/* Holographic Shine Accent */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                {!isFlipped ? (
                  // Front Face
                  <>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        {/* EMV Chip */}
                        <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-200 to-amber-400 p-1 border border-amber-500/50 flex items-center justify-center shadow-inner">
                          <div className="w-full h-full border border-amber-600/30 rounded-xs" />
                        </div>
                        <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">
                          Contactless
                        </span>
                      </div>

                      {card.isDefault && (
                        <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-1 rounded-full">
                          Default Card
                        </span>
                      )}
                    </div>

                    <div className="my-4 relative z-10">
                      <p className="text-lg font-mono font-bold tracking-widest text-slate-100">
                        {card.cardNumberMasked}
                      </p>
                    </div>

                    <div className="flex items-center justify-between relative z-10 text-xs">
                      <div>
                        <p className="text-[9px] uppercase font-mono text-slate-400">Card Holder</p>
                        <p className="font-bold text-white uppercase tracking-wider">{card.cardHolder}</p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase font-mono text-slate-400">Expires</p>
                        <p className="font-mono font-bold text-slate-200">{card.expiry}</p>
                      </div>

                      <div className="uppercase font-extrabold text-sm font-mono tracking-wider text-right">
                        {card.brand}
                      </div>
                    </div>
                  </>
                ) : (
                  // Back Face (Flipped details)
                  <div className="flex flex-col justify-between h-full relative z-10 py-2">
                    <div className="w-full h-8 bg-slate-950/80 rounded-md -mx-6 px-6 flex items-center justify-end">
                      <span className="text-[10px] font-mono text-slate-400">Magnetic Stripe</span>
                    </div>

                    <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-center font-mono">
                      <span className="text-[10px] text-slate-300 uppercase block">Security CVV</span>
                      <span className="text-lg font-bold text-amber-300">{card.cvv || '888'}</span>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center">
                      Protected by WeXTransfer 256-Bit Hardware Security Engine
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons underneath card */}
              <div className="mt-3 flex items-center justify-between px-2 text-xs font-semibold">
                <button
                  onClick={() => setFlippedCardId(isFlipped ? null : card.id)}
                  className="text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{isFlipped ? 'Show Front' : 'Flip Card'}</span>
                </button>

                {!card.isDefault && (
                  <button
                    onClick={() => handleSetDefault(card.id)}
                    className="text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Set Default
                  </button>
                )}

                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="text-rose-500 hover:text-rose-600 cursor-pointer p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl border border-slate-200 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Add Saved Payment Card</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Interactive Card Preview */}
            <div className="w-full h-48 rounded-2xl p-5 text-white shadow-xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 border border-white/20 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest text-slate-300">CARD PREVIEW</span>
                <span className="uppercase font-bold text-xs font-mono">{newBrand}</span>
              </div>
              <p className="text-base font-mono font-bold tracking-widest text-slate-100">
                {newCardNumber || '•••• •••• •••• ••••'}
              </p>
              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="text-[9px] uppercase font-mono text-slate-400">Card Holder</p>
                  <p className="font-bold text-white uppercase">{newCardHolder || 'ALEX MORGAN'}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-mono text-slate-400">Expires</p>
                  <p className="font-mono font-bold text-slate-200">{newExpiry || 'MM/YY'}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Card Brand
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['visa', 'mastercard', 'amex'] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setNewBrand(b)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                        newBrand === b
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  value={newCardHolder}
                  onChange={(e) => setNewCardHolder(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Expiry
                  </label>
                  <input
                    type="text"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    required
                    placeholder="MM/YY"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={newCvv}
                    onChange={(e) => setNewCvv(e.target.value)}
                    required
                    maxLength={4}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-3 px-4 text-slate-600 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

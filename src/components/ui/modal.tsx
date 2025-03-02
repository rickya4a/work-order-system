interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with stronger blur and darker overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content with stronger shadow and border */}
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-gray-200 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
          </div>
          <div className="px-6 py-4 bg-white rounded-b-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
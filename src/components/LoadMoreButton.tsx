
'use client'

interface LoadMoreButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function LoadMoreButton({
  onClick,
  disabled = false,
}: LoadMoreButtonProps) {

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        px-6
        py-2
        font-medium
        text-white
        bg-blue-600
        hover:bg-blue-700
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        disabled:cursor-not-allowed
        disabled:bg-blue-300
        disabled:hover:bg-blue-300
        rounded
        transition
      `}
    >
      {disabled ? 'No more posts' : 'Load More'}
    </button>
  )

}


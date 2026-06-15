export type DisplayJobTag = {
  label: string
  isOverflow: boolean
}

export function getDisplayJobTags(
  tags: string[],
  visibleTagCount = 3
): DisplayJobTag[] {
  if (tags.length <= visibleTagCount) {
    return tags.map((tag) => ({
      label: tag,
      isOverflow: false,
    }))
  }

  return [
    ...tags.slice(0, visibleTagCount).map((tag) => ({
      label: tag,
      isOverflow: false,
    })),
    {
      label: `+${tags.length - visibleTagCount}`,
      isOverflow: true,
    },
  ]
}

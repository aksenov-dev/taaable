export const formatTimestampToStringDate = (timestamp: number): string => {
  const monthList = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const date = new Date(timestamp)

  if(isNaN(date.getTime())) return ''

  return `${date.getDate()} ${monthList[date.getMonth()]} ${date.getFullYear()} г.`
}

export const setCurrentWords = function ({ dispatch, state }) {
  var text = 'In the beginning was the Word, and the Word was with God, and the Word was God. He was in the beginning with God. All things were made through him, and without him was not any thing made that was made.'
  dispatch('CURRENT_WORDS', text.split(' '))
}

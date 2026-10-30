import {defineArrayMember, defineType} from 'sanity'

export const blockContent = defineType({
  title: 'Isi artikel',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Judul bagian', value: 'h2'},
      ],
      lists: [{title: 'Daftar', value: 'bullet'}],
      marks: {
        decorators: [
          {title: 'Tebal', value: 'strong'},
          {title: 'Miring', value: 'em'},
        ],
        annotations: [],
      },
    }),
  ],
})

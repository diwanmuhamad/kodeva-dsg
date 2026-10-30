import {defineField, defineType} from 'sanity'

/** Cover/hero image: upload Sanity image, use product shot, or a local preset illustration. */
export const cmsImage = defineType({
  name: 'cmsImage',
  title: 'Gambar konten',
  type: 'object',
  fields: [
    defineField({
      name: 'mode',
      title: 'Sumber gambar',
      type: 'string',
      options: {
        list: [
          {title: 'Unggah ke Sanity', value: 'upload'},
          {title: 'Ilustrasi produk (dari katalog)', value: 'product'},
          {title: 'Preset toko', value: 'preset:toko'},
          {title: 'Preset tim', value: 'preset:tim'},
          {title: 'Preset laporan', value: 'preset:laporan'},
        ],
        layout: 'radio',
      },
      initialValue: 'upload',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'asset',
      title: 'File gambar',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.mode !== 'upload',
    }),
    defineField({
      name: 'alt',
      title: 'Teks alternatif',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(160),
    }),
  ],
  preview: {
    select: {title: 'alt', mode: 'mode', media: 'asset'},
    prepare({title, mode, media}) {
      return {
        title: title || 'Gambar',
        subtitle: mode,
        media,
      }
    },
  },
})

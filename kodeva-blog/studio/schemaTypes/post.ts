import {defineField, defineType} from 'sanity'

const productOptions = [
  {title: 'Kodeva Kasir', value: 'kodeva-kasir'},
  {title: 'Kodeva Inventori', value: 'kodeva-inventori'},
  {title: 'Kodeva HR', value: 'kodeva-hr'},
  {title: 'Kodeva Absensi', value: 'kodeva-absensi'},
  {title: 'Kodeva Akuntansi', value: 'kodeva-akuntansi'},
  {title: 'Kodeva Invoice', value: 'kodeva-invoice'},
  {title: 'Kodeva CRM', value: 'kodeva-crm'},
]

export const post = defineType({
  name: 'post',
  title: 'Artikel blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul',
      type: 'string',
      validation: (rule) => rule.required().min(4).max(140),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Ringkasan',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(10).max(240),
    }),
    defineField({
      name: 'cover',
      title: 'Gambar sampul',
      type: 'cmsImage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          {title: 'Promo', value: 'Promo'},
          {title: 'SDM', value: 'SDM'},
          {title: 'Operasional', value: 'Operasional'},
          {title: 'Keuangan', value: 'Keuangan'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draf', value: 'draft'},
          {title: 'Terbit', value: 'published'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal terbit',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'productSlug',
      title: 'Tautan produk katalog',
      type: 'string',
      options: {list: productOptions},
      description: 'Opsional. Artikel bisa menaut ke satu produk di marketplace.',
    }),
    defineField({
      name: 'body',
      title: 'Isi',
      type: 'blockContent',
      validation: (rule) => rule.required().min(1),
    }),
  ],
  orderings: [
    {
      title: 'Tanggal terbit, terbaru',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      category: 'category',
      media: 'cover.asset',
    },
    prepare({title, status, category, media}) {
      return {
        title,
        subtitle: `${status === 'published' ? 'Terbit' : 'Draf'} · ${category || ''}`,
        media,
      }
    },
  },
})

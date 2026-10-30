import {defineArrayMember, defineField, defineType} from 'sanity'

const productOptions = [
  {title: 'Kodeva Kasir', value: 'kodeva-kasir'},
  {title: 'Kodeva Inventori', value: 'kodeva-inventori'},
  {title: 'Kodeva HR', value: 'kodeva-hr'},
  {title: 'Kodeva Absensi', value: 'kodeva-absensi'},
  {title: 'Kodeva Akuntansi', value: 'kodeva-akuntansi'},
  {title: 'Kodeva Invoice', value: 'kodeva-invoice'},
  {title: 'Kodeva CRM', value: 'kodeva-crm'},
]

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Halaman promo (landing)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nama dokumen',
      type: 'string',
      initialValue: 'Promo Akhir Tahun',
      readOnly: true,
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Label kecil', type: 'string', validation: (r) => r.required().max(80)}),
        defineField({name: 'title', title: 'Judul', type: 'string', validation: (r) => r.required().min(8).max(140)}),
        defineField({name: 'subtitle', title: 'Subjudul', type: 'text', rows: 3, validation: (r) => r.required().min(20).max(400)}),
        defineField({name: 'image', title: 'Gambar', type: 'cmsImage', validation: (r) => r.required()}),
        defineField({name: 'ctaLabel', title: 'Teks tombol CTA', type: 'string', validation: (r) => r.required().max(40)}),
        defineField({
          name: 'ctaHref',
          title: 'Tautan CTA',
          type: 'string',
          initialValue: '/katalog',
          validation: (r) =>
            r.required().custom((value) => {
              if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
                return 'Tautan harus path lokal, contoh /katalog'
              }
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Produk unggulan',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Judul bagian', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'intro', title: 'Pengantar', type: 'text', rows: 2, validation: (r) => r.required()}),
        defineField({
          name: 'items',
          title: 'Item',
          type: 'array',
          validation: (r) => r.required().min(1).max(6),
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'productSlug',
                  title: 'Produk',
                  type: 'string',
                  options: {list: productOptions},
                  validation: (r) => r.required(),
                }),
                defineField({name: 'headline', title: 'Judul kartu', type: 'string', validation: (r) => r.required().max(120)}),
                defineField({name: 'image', title: 'Gambar', type: 'cmsImage', validation: (r) => r.required()}),
              ],
              preview: {
                select: {title: 'headline', subtitle: 'productSlug'},
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimoni',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Judul bagian', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'intro', title: 'Pengantar', type: 'text', rows: 2, validation: (r) => r.required()}),
        defineField({
          name: 'items',
          title: 'Kutipan',
          type: 'array',
          validation: (r) => r.required().min(1).max(8),
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'quote', title: 'Kutipan', type: 'text', rows: 3, validation: (r) => r.required().max(320)}),
                defineField({name: 'name', title: 'Nama', type: 'string', validation: (r) => r.required()}),
                defineField({name: 'role', title: 'Peran', type: 'string', validation: (r) => r.required()}),
                defineField({name: 'company', title: 'Usaha', type: 'string', validation: (r) => r.required()}),
              ],
              preview: {
                select: {title: 'name', subtitle: 'company'},
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Judul bagian', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'intro', title: 'Pengantar', type: 'text', rows: 2, validation: (r) => r.required()}),
        defineField({
          name: 'items',
          title: 'Pertanyaan',
          type: 'array',
          validation: (r) => r.required().min(1).max(10),
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'question', title: 'Pertanyaan', type: 'string', validation: (r) => r.required().max(160)}),
                defineField({name: 'answer', title: 'Jawaban', type: 'text', rows: 3, validation: (r) => r.required().max(500)}),
              ],
              preview: {
                select: {title: 'question'},
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'lead',
      title: 'Form lead',
      type: 'object',
      fields: [
        defineField({name: 'heading', title: 'Judul', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'intro', title: 'Pengantar', type: 'text', rows: 2, validation: (r) => r.required()}),
        defineField({name: 'note', title: 'Catatan privasi', type: 'string', validation: (r) => r.required()}),
        defineField({name: 'submitLabel', title: 'Teks tombol kirim', type: 'string', validation: (r) => r.required().max(40)}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Halaman promo (landing)'}
    },
  },
})

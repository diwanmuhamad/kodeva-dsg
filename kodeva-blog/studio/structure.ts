import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Konten Kodeva')
    .items([
      S.listItem()
        .title('Halaman promo (landing)')
        .id('landingPage')
        .child(S.document().schemaType('landingPage').documentId('landingPage')),
      S.divider(),
      S.documentTypeListItem('post').title('Artikel blog'),
    ])

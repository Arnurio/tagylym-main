import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Tagylym',

  projectId: 'n0mbi7p9',
  dataset: 'production',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Содержание')
          .items([
            S.listItem()
              .title('Инновационный проект (Innovation)')
              .child(
                S.documentList()
                  .title('Innovation Project')
                  .filter('_type == "lesson" && category == "innovation"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.listItem()
              .title('Рободизайн (Robot Design)')
              .child(
                S.documentList()
                  .title('Robot Design')
                  .filter('_type == "lesson" && category == "robot-design"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.listItem()
              .title('Робоигра (Robot Game)')
              .child(
                S.documentList()
                  .title('Robot Game')
                  .filter('_type == "lesson" && category == "robot-game"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.listItem()
              .title('Программирование (Coding)')
              .child(
                S.documentList()
                  .title('Coding')
                  .filter('_type == "lesson" && category == "coding"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.divider(),
            S.listItem()
              .title('Все уроки (без фильтра)')
              .child(
                S.documentList()
                  .title('Все уроки')
                  .filter('_type == "lesson"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.listItem()
              .title('Курсы')
              .child(
                S.documentList()
                  .title('Курсы по порядку')
                  .filter('_type == "course"')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})

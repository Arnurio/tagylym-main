-- Normalize level names from Russian to English slugs
UPDATE levels SET name = 'beginner' WHERE name = 'Начинающий';
UPDATE levels SET name = 'intermediate' WHERE name = 'Средний';
UPDATE levels SET name = 'advanced' WHERE name = 'Продвинутый';

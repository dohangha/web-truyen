import { cache } from 'react';

import { getRecordMap, mapImageUrl } from '@/libs/notion';
import { Post } from '@/types/post';
import { getBlurImage } from '@/utils/get-blur-image';

// cache() giúp nhiều nơi gọi hàm này trong CÙNG 1 lần tải trang (ví dụ vừa
// cần cho metadata, vừa cần cho nội dung) chỉ thực sự gọi Notion API 1 lần,
// dùng lại kết quả thay vì gọi lặp lại nhiều lần.
export const getAllPostsFromNotion = cache(async () => {
  const allPosts: Post[] = [];
  const recordMap = await getRecordMap(process.env.NOTION_DATABASE_ID!);
  const { block, collection } = recordMap;
  const schema = Object.values(collection)[0].value.value.schema;
  const propertyMap: Record<string, string> = {};

  Object.keys(schema).forEach((key) => {
    propertyMap[schema[key].name] = key;
  });

  Object.keys(block).forEach((pageId) => {
    const blockValue = block[pageId]?.value?.value;

    if (
      blockValue &&
      blockValue.type === 'page' &&
      blockValue.properties?.[propertyMap['Slug']]
    ) {
      const { properties, last_edited_time } = blockValue;

      const contents = blockValue.content || [];
      const dates = contents.map((content) => {
        return block[content]?.value?.value?.last_edited_time;
      });
      dates.push(last_edited_time);
      dates.sort((a, b) => b - a);
      const lastEditedAt = dates[0];

      const id = pageId;
      const slug = properties[propertyMap['Slug']][0][0];
      const title = properties[propertyMap['Page']][0][0];
      const categories = properties[propertyMap['Category']][0][0].split(',');
      const cover = properties[propertyMap['Cover']][0][1][0][1];
      const date = properties[propertyMap['Date']][0][1][0][1]['start_date'];
      const published = properties[propertyMap['Published']][0][0] === 'Yes';

      const viewsKey = propertyMap['Lượt Xem'];
      const views =
        viewsKey && properties[viewsKey]
          ? Number(properties[viewsKey][0][0]) || 0
          : 0;

      const statusKey = propertyMap['Trạng Thái'];
      const status =
        statusKey && properties[statusKey]
          ? properties[statusKey][0][0]
          : undefined;

      const accessKey = propertyMap['Truy Cập'];
      const access =
        accessKey && properties[accessKey]
          ? properties[accessKey][0][0]
          : undefined;

      allPosts.push({
        id,
        title,
        slug,
        categories,
        cover: mapImageUrl(cover, blockValue) || '',
        date,
        published,
        lastEditedAt,
        views,
        status,
        access,
      });
    }
  });

  const blurImagesPromises = allPosts.map((post) => getBlurImage(post.cover));
  const blurImages = await Promise.all(blurImagesPromises);
  allPosts.forEach((post, i) => (post.blurUrl = blurImages[i].base64));

  return allPosts;
});

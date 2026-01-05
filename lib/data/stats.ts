import { client } from "@/sanity/lib/client";

export async function getDocumentCount(
  documentType: string,
  filter?: string,
): Promise<number> {
  const filterQuery = filter ? ` && ${filter}` : "";
  const query = `count(*[_type == "${documentType}"${filterQuery}])`;

  const count = await client.fetch<number>(query);
  return count;
}

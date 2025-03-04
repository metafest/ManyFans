import z from "zod";

export default eventHandler(async (event) => {
  const { pathname } = await getValidatedRouterParams(
    event,
    z.object({
      pathname: z.string().min(1),
    }).parse
  );

  // Set Content-Disposition header to trigger file download
  // setHeader(event, "Content-Disposition", `inline;filename=${pathname}`);

  return hubBlob().serve(event, pathname);
});

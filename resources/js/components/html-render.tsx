type HtmlRenderProps = {
    html: string | null;
};

export function HtmlRender({ html }: HtmlRenderProps) {
    return (
        <article
            className="html-render min-h-96 max-w-none border border-[#dce5f1] bg-white p-6 text-[#263a63] sm:p-9"
            dangerouslySetInnerHTML={{
                __html: html || '<p>Isi materi belum tersedia.</p>',
            }}
        />
    );
}

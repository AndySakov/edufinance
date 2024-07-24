export interface ViewDocProps {
  url: string;
}

export const ViewDoc = ({ url }: ViewDocProps) => {
  return (
    <div className="mx-auto min-w-[50%] min-h-[70%] text-center">
      <iframe
        src={url}
        className="w-full h-full"
        title="View Doc"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};

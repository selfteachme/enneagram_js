const Block = ({ node }) => {
  if (node.type == "heading")
    return <h3 className="my-4">{node.nodes[0].text}</h3>;
  return <p className="body">{node.nodes[0].text}</p>;
};

export { Block };

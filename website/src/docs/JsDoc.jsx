import jsdoc from '../../../doc.json'; // doc.json is built with `npm run jsdoc-json`
const docs = jsdoc.docs.reduce((acc, obj) => Object.assign(acc, { [obj.longname]: obj }), {});
import { MiniRepl } from './MiniRepl';

const getTag = (title, item) => item.tags?.find((t) => t.title === title)?.text;

export function JsDoc({ name, h = 3, hideDescription }) {
  const item = docs[name];
  if (!item) {
    console.warn('Not found: ' + name);
    return <div />;
  }
  const synonyms = getTag('synonyms', item)?.split(', ') || [];
  const CustomHeading = `h${h}`;
  const description = item.description.replaceAll(/\{@link ([a-zA-Z\.]+)?#?([a-zA-Z]*)\}/g, (_, a, b) => {
    // console.log(_, 'a', a, 'b', b);
    return `<a href="#${a.replaceAll('.', '').toLowerCase()}${b ? `-${b}` : ''}">${a}${b ? `#${b}` : ''}</a>`;
  });
  return (
    <>
      {!!h && <CustomHeading>{item.longname}</CustomHeading>}
      {!hideDescription && (
        <>
          {!!synonyms.length && (
            <span>
              Synonyms: <code>{synonyms.join(', ')}</code>
            </span>
          )}
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </>
      )}
      <ul>
        {item.params?.map((param, i) => (
          <li key={i}>
            {param.name} ({param.type?.names?.join('|')}): {param.description?.replace(/(<([^>]+)>)/gi, '')}
          </li>
        ))}
      </ul>

      {item.examples?.length ? (
        <div className="space-y-2">
          {item.examples?.map((example, k) => (
            <MiniRepl tune={example} key={k} />
          ))}
        </div>
      ) : (
        <div />
      )}
    </>
  );
}

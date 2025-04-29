import * as xml2js from 'isomorphic-xml2js';
import { DiffResultXmljs, MultiDocXmljs, SingleDocXmljs } from './xmlTypes';

// eventhough it is called "xml2js" we call it "xmljs" for brevity
// don't confuse with Browser DOM XML (stringifyDomXml)

export const parseToXmljs = <
  T extends SingleDocXmljs | MultiDocXmljs | DiffResultXmljs = SingleDocXmljs,
>(
  xmlString: string,
) => {
  const parser = new xml2js.Parser({
    explicitArray: true, //every item is array
    explicitCharkey: false,
    explicitRoot: false,
  });

  return new Promise<T>((resolve, reject) => {
    parser.parseString(xmlString, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const buildXml = (xml: SingleDocXmljs | MultiDocXmljs, rootName: string) => {
  const builder = new xml2js.Builder({ rootName });
  return builder.buildObject(xml);
};

export const xmljsBuildOsm = (xml: SingleDocXmljs | MultiDocXmljs) =>
  buildXml(xml, 'osm');

import ReactDOM from 'react-dom/client';

export function printComponent(Component: any, props: any = {}) {
  const iframe = document.createElement('iframe');

  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  // Copy styles
  const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
  styles.forEach((style) => {
    doc.write(style.outerHTML);
  });

  const container = doc.createElement('div');
  doc.body.appendChild(container);

  const root = ReactDOM.createRoot(container);

  root.render(<Component {...props} />);

  setTimeout(() => {
    if (iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }

    setTimeout(() => {
      root.unmount();
      document.body.removeChild(iframe);
    }, 1000);
  }, 300);
}

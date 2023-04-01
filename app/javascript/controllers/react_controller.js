import { Controller } from "@hotwired/stimulus"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../react/src/app';
import './styles.css'
export default class extends Controller {
  connect() {
    document.addEventListener("DOMContentLoaded", () => {
      let root = ReactDOM.createRoot(document.getElementById('app'));
      root.render(<App />);
    });
  }
}
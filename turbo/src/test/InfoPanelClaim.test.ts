import { locale } from 'svelte-i18n';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import InfoPanelClaim from '$components/report/InfoPanelClaim.svelte';
import merge from '$lib/mock_data/merge/merge.json';
import csv from '$lib/mock_data/csv/csv.json';
import csvNoVideo from '$lib/mock_data/csv/csv_no_video.json';

locale.set('en-US');

describe('InfoPanelClaim', () => {
  it('testing vimeo claim', async () => {
    const claim = merge['topics'][0]['subtopics'][0]['claims'][0];
    render(InfoPanelClaim, {
      props: { showVideo: true, claim, csv, showClaims: true }
    });
    const element = screen.getByText(claim.claim);
    expect(element).to.exist;
    const iframe = document.getElementById('player') as HTMLIFrameElement;
    expect(iframe.src).toBe('https://player.vimeo.com/video/848581988#t=120s');
  });
  it('testing yt claim', async () => {
    const claim = merge['topics'][1]['subtopics'][0]['claims'][0];
    render(InfoPanelClaim, {
      props: { showVideo: true, claim, csv, showClaims: true }
    });
    const element = screen.getByText(claim.claim);
    expect(element).to.exist;
    const iframe = document.getElementById('player') as HTMLIFrameElement;
    expect(iframe.src).toBe('https://www.youtube.com/embed/Vxmecypi03w?start=60');
  });
  it('testing yt link has si', async () => {
    const claim = merge['topics'][1]['subtopics'][0]['claims'][0];
    csv[0].video = 'https://www.youtube.com/embed/Vxmecypi03w?si=68itEHCI1cnCXQbJ';
    render(InfoPanelClaim, {
      props: { showVideo: true, claim, csv, showClaims: true }
    });
    const element = screen.getByText(claim.claim);
    expect(element).to.exist;
    const iframe = document.getElementById('player') as HTMLIFrameElement;
    expect(iframe.src).toBe('https://www.youtube.com/embed/Vxmecypi03w?start=60');
  });
  it('testing yt link has timestamp', async () => {
    const claim = merge['topics'][1]['subtopics'][0]['claims'][0];
    csv[0].video = 'https://www.youtube.com/embed/Vxmecypi03w?start=60';
    render(InfoPanelClaim, {
      props: { showVideo: true, claim, csv, showClaims: true }
    });
    const element = screen.getByText(claim.claim);
    expect(element).to.exist;
    const iframe = document.getElementById('player') as HTMLIFrameElement;
    expect(iframe.src).toBe('https://www.youtube.com/embed/Vxmecypi03w?start=60');
  });
  it('testing yt link has si and timestamp', async () => {
    const claim = merge['topics'][1]['subtopics'][0]['claims'][0];
    csv[0].video = 'https://www.youtube.com/embed/Vxmecypi03w?si=68itEHCI1cnCXQbJ&start=60';
    render(InfoPanelClaim, {
      props: { showVideo: true, claim, csv, showClaims: true }
    });
    const element = screen.getByText(claim.claim);
    expect(element).to.exist;
    const iframe = document.getElementById('player') as HTMLIFrameElement;
    expect(iframe.src).toBe('https://www.youtube.com/embed/Vxmecypi03w?start=60');
  });
  it('testing no video', async () => {
    const claim = merge['topics'][1]['subtopics'][0]['claims'][0];
    render(InfoPanelClaim, {
      props: { showVideo: true, claim, csv: csvNoVideo, showClaims: true }
    });
    const element = screen.getByText(claim.claim);
    expect(element).to.exist;
    const iframe = document.getElementById('player') as HTMLIFrameElement;
    expect(iframe).toBe(null);
  });
  it('testing no claim throws error', async () => {
    const claim = undefined;
    expect(() => {
      render(InfoPanelClaim, {
        props: { showVideo: true, claim, csv, showClaims: true }
      });
    }).toThrow();
  });
});

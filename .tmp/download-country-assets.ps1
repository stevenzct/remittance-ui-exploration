$ErrorActionPreference = 'Stop'
$assets = @(
  @('transition-singapore.png', 'https://www.figma.com/api/mcp/asset/49df5dec-aab4-4a5b-89e3-08525ad62d8d.png'),
  @('transition-saudi-arabia.png', 'https://www.figma.com/api/mcp/asset/2cec42f6-aaaa-4e95-b5dc-ba8dc7718303.png'),
  @('flag-watermark-sg.png', 'https://www.figma.com/api/mcp/asset/38df1b79-ff3a-4f07-aaf7-9f7b8b202fa3.png'),
  @('flag-watermark-sa.png', 'https://www.figma.com/api/mcp/asset/905bc96b-25d4-4040-9234-a38d35ae47fb.png'),
  @('icon-add-account.png', 'https://www.figma.com/api/mcp/asset/c8e1218c-26ec-41e8-8350-b49b28c07607.png'),
  @('country-pill-sg-selected.svg', 'https://www.figma.com/api/mcp/asset/2ce916e9-938c-4e68-b7ee-5a2685bec81a.svg'),
  @('country-pill-sa-selected.svg', 'https://www.figma.com/api/mcp/asset/cdbde30e-d611-4769-af44-a5cbc9b9fc7b.svg')
)
foreach ($asset in $assets) {
  $target = Join-Path 'C:/Users/Admin/Documents/remittance-ui-exploration/public/assets/prototype-v1' $asset[0]
  Invoke-WebRequest -UseBasicParsing -Uri $asset[1] -OutFile $target
  Get-Item -LiteralPath $target | Select-Object Name, Length
}

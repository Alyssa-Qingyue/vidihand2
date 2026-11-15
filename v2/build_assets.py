from pathlib import Path
import fitz,json,re
from PIL import Image
P=Path(__file__).resolve().parent
paper=P.parents[1]/'overleaf-sync/project'
for name,src in [('teaser','fig_teaser_v9'),('method','fig_pipeline_v11'),('focal','fig_intro_focal')]:
 d=fitz.open(paper/'figures'/(src+'.pdf'));d[0].get_pixmap(matrix=fitz.Matrix(2,2),alpha=False).save(P/(name+'.png'))
rows=[]
for line in (paper/'tables/main_comparison.tex').read_text().splitlines():
 if ' & ' not in line:continue
 parts=line.split(' & ')
 if len(parts)!=15:continue
 nums=[re.sub(r'\\best\{([^}]+)\}',r'\1',x).replace('\\\\','').strip() for x in parts[1:]]
 try:values=list(map(float,nums))
 except ValueError:continue
 name=parts[0].split('~')[0].replace('\\textbf{\\ours (Ours)}','ViDiHand V2')
 rows.append({'method':name,'values':values})
(P/'results.json').write_text(json.dumps(rows,indent=2))
renders=P.parents[1]/'paper/renders'
cases=[]
for frame,ds,label in [(2305,'gen_humanego_1h','Weaving a basket'),(3989,'gen_humanego_1h','Everyday manipulation'),(3123,'ego4d','Washing dishes'),(106,'xperience','Using a phone')]:
 paths=list(renders.glob(f'{ds}__*__f{frame}.png'))
 if not paths:continue
 im=Image.open(paths[0]);folder=P/f'case-{frame}';folder.mkdir(exist_ok=True)
 for key,n in {'input':0,'wilor':9,'mint':14,'v1':17,'ace':18,'ours':19}.items():
  x=(n%7)*652;y=60+(n//7)*540
  im.crop((x,y,x+640,y+480)).save(folder/(key+'.jpg'),quality=92)
 cases.append({'frame':frame,'dataset':{'gen_humanego_1h':'Gen-HumanEgo','ego4d':'Ego4D','xperience':'Xperience'}[ds],'label':label,'source':paths[0].stem})
(P/'cases.json').write_text(json.dumps(cases,indent=2))
